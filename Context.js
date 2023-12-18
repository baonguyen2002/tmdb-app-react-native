import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState("");

  const [requestToken, setRequestToken] = useState("");
  const [approved, setApproved] = useState(false);
  const [accountDetail, setAccountDetail] = useState("");
  const [listOfLists, setListOfLists] = useState([]);
  const [isResultChanged, setIsResultChanged] = useState(false);

  return (
    <Context.Provider
      value={{
        sessionId,
        setSessionId,
        requestToken,
        setRequestToken,
        approved,
        setApproved,
        accountDetail,
        setAccountDetail,
        listOfLists,
        setListOfLists,
        isResultChanged,
        setIsResultChanged,
      }}
    >
      {children}
    </Context.Provider>
  );
};
