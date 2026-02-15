import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import "./App.css";

import PopUp from "./components/popUp.tsx";
import MainTable from "./components/mainTable.tsx";
import { useAppSelector } from "./store/hooks.ts";

function AppContent() {
  const state = useAppSelector((state) => state.auth);
  return <div>{state.isAuthenticated ? <MainTable /> : <PopUp />}</div>;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
