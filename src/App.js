import React from "react";
import { RoomAllocation } from "@src/components/RoomAllocation";

import "./scss/main.scss";

const App = () => {
  return <RoomAllocation guest={12} room={3} onChange={(result) => console.log(result)} />;
};

export default App;
