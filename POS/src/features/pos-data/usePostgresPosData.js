import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getPosData } from '../../shared/api/posApi.js'

function usePostgresPosData(session) {
  const [state, setState] = useState({
    loading: true,
    error: '',
    memberships: [],
    stockItems: [],
    sales: [],
    salesDetails: [],
    stockMutations: [],
    customers: [],
    shifts: [],
    categories: [],
    noteCategories: [],
    recipes: [],
  })

  const refresh = async () => {
    if (!session?.user?.id) return
    setState((current) => ({ ...current, loading: true, error: '' }))
    let data
    try {
      data = await getPosData(session.user.id)
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }))
      toast.error(error.message)
      return
    }

    setState({
      loading: false,
      error: '',
      memberships: data.memberships || [],
      stockItems: data.stockItems || [],
      sales: data.sales || [],
      salesDetails: data.salesDetails || [],
      stockMutations: data.stockMutations || [],
      customers: data.customers || [],
      shifts: data.shifts || [],
      categories: data.categories || [],
      noteCategories: data.noteCategories || [],
      recipes: data.recipes || [],
    })
  }

  useEffect(() => {
    refresh()
  }, [session?.user?.id])

  return { ...state, refresh }
}


export { usePostgresPosData }
