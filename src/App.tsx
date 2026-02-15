import {Provider} from "react-redux";
import {store} from "./store/store.ts";


import './App.css'

import PopUp from "./components/popUp.tsx";

function App() {


  return (

    <Provider store={store}>
      <PopUp></PopUp>
    </Provider>


  )
}

export default App