import { ADD, MINUS } from "./actions-type";
let initState = { number: 0 }

// 处理器
export default function reducer(state = initState, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 }
      break;
    case MINUS:
      return { number: state.number - 1 }
      break;
    case 'no1':
        state.number = 0;
        return {number: 0}
        break;
    case 'no2':
        state.number = 1;
        return {number: 1}
        break;
    case 'no3':
        state.number = 2;
        return {number: 2}
        break;
    default:
      return state
      break;
  }
}