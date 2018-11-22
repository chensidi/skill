import { ADD, MINUS } from './actions-types'
export default {
  add () {
    return {type: ADD}
  },
  minus() {
    return { type: MINUS }
  }
}
