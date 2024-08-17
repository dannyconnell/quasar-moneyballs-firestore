import { defineStore } from 'pinia'
import { ref, computed, reactive, nextTick } from 'vue'
import { Notify, Dialog } from 'quasar'
import { useStoreAuth } from 'src/stores/storeAuth'
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'

let entriesCollectionRef = null,
    entriesQueryRef = null,
    getEntriesSnapshot = null

export const useStoreEntries = defineStore('entries', () => {

  /*
    state
  */
  
    const entries = ref([
      // {
      //   id: 'id1',
      //   name: 'Salary',
      //   amount: 4999.99,
      //   paid: true,
      //   order: 1
      // },
      // {
      //   id: 'id2',
      //   name: 'Rent',
      //   amount: -999,
      //   paid: false,
      //   order: 2
      // },
      // {
      //   id: 'id3',
      //   name: 'Phone bill',
      //   amount: -14.99,
      //   paid: false,
      //   order: 3
      // },
      // {
      //   id: 'id4',
      //   name: 'Unknown',
      //   amount: 0,
      //   paid: false,
      //   order: 4
      // },
    ])

    const entriesLoaded = ref(false)

    const options = reactive({
      sort: false
    })


  /*
    getters
  */
  
    const balance = computed(() => {
      return entries.value.reduce((accumulator, { amount }) => {
        return accumulator + amount
      }, 0)
    })

    const balancePaid = computed(() => {
      return entries.value.reduce((accumulator, { amount, paid }) => {
        return paid ? accumulator + amount : accumulator
      }, 0)
    })

    const runningBalances = computed(() => {
      let runningBalances = [],
          currentRunningBalance = 0

      if (entries.value.length) {
        entries.value.forEach(entry => {
          let entryAmount = entry.amount ? entry.amount : 0
          currentRunningBalance = currentRunningBalance + entryAmount
          runningBalances.push(currentRunningBalance)
        })
      }

      return runningBalances
    })


  /*
    actions
  */
  
    const init = () => {
      const storeAuth = useStoreAuth()
      entriesCollectionRef = collection(db, 'users', storeAuth.userDetails.id, 'entries')
      entriesQueryRef = query(entriesCollectionRef, orderBy('order'))
      loadEntries()
    }

    const loadEntries = async (showLoader = true) => {
      if (showLoader) entriesLoaded.value = false
      getEntriesSnapshot = onSnapshot(entriesQueryRef, (querySnapshot) => {
        let entriesFB = []
        querySnapshot.forEach((doc) => {
          let entry = doc.data()
          entry.id = doc.id
          entriesFB.push(entry)
        })
        entries.value = entriesFB
        entriesLoaded.value = true
      }, error => {
        Dialog.create({
          title: 'Error',
          message: error.message
        })
      })
    }

    const clearAndStopEntries = () => {
      entries.value = []
      if (getEntriesSnapshot) getEntriesSnapshot()
    }

    const addEntry = async addEntryForm => {
      const newEntry = Object.assign({}, addEntryForm, 
        { 
          paid: false,
          order: generateOrderNumber()
        }
      )
      if (newEntry.amount ===  null) newEntry.amount = 0
      await addDoc(entriesCollectionRef, newEntry)
    }

    const deleteEntry = async entryId => {
      await deleteDoc(doc(entriesCollectionRef, entryId))
      removeSlideItemIfExists(entryId)
      Notify.create({
        message: 'Entry deleted',
        position: 'top'
      })
    }

    const updateEntry = async (entryId, updates) => {
      await updateDoc(doc(entriesCollectionRef, entryId), updates)
    }

    const updateEntryOrderNumbers = async () => {
      let currentOrder = 1
      entries.value.forEach(entry => {
        entry.order = currentOrder
        currentOrder++
      })

      getEntriesSnapshot()
      await Promise.all(entries.value.map(async entry => {
        await updateEntry(entry.id, { order: entry.order })
      }))
      loadEntries(false)
    }

    const sortEnd = ({ oldIndex, newIndex }) => {
      const movedEntry = entries.value[oldIndex]
      entries.value.splice(oldIndex, 1)
      entries.value.splice(newIndex, 0, movedEntry)
      updateEntryOrderNumbers()
    }


  /*
    helpers
  */
  
    const generateOrderNumber = () => {
      const orderNumbers = entries.value.map(entry => entry.order),
            newOrderNumber = orderNumbers.length
                             ? Math.max(...orderNumbers) + 1
                             : 1
      return newOrderNumber
    }

    const removeSlideItemIfExists = entryId => {
      // hacky fix: when deleting (after sorting),
      // sometimes the slide item is not removed
      // from the dom. this will remove the slide
      // item from the dom if it still exists
      // (after entry removed from entries array)
      nextTick(() => {
        const slideItem = document.querySelector(`#id-${ entryId }`)
        if (slideItem) slideItem.remove()
      })
    }


  /*
    return
  */
  
    return { 

      // state
      entries,
      entriesLoaded,
      options,

      // getters
      balance,
      balancePaid,
      runningBalances,

      // actions
      init,
      loadEntries,
      clearAndStopEntries,
      addEntry,
      deleteEntry,
      updateEntry,
      sortEnd

    }
    
})