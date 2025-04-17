import React from "react";
import Sidebar from "./components/sidebar/sidebar";
import Main from "./components/main/main";
import ContextProvider from "./context/Context";

const App = () => {
  return (
    <ContextProvider>
      <Sidebar />
      <Main />
    </ContextProvider>
  );
};

export default App;
