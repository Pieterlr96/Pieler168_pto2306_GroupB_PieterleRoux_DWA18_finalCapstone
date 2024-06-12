"use client";
import { createContext, useReducer, useEffect,useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { duration } from "moment";
// import axios from "axios";
// import { useRouter } from "next/router";

const initialState = {
  season: null,
  episode: null,
  favorite: [],
  user: null,
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

//create context
const Context = createContext();

//root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "Play":
      return { ...state, episode: action.payload };
      break;
    case "Season":
      return { ...state, season: action.payload };
    case "Favorite":
      // console.log("favorite: ", action.payload);
      return { ...state, favorite: action.payload };
    case "User":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  useEffect(() => {
    async function getFavorite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if(!user) return;
      const { data, error } = await supabase
        .from("favoriteList")
        .select()
        .eq("userId", user.email);
      // console.log("favorite data: context api ", data);
      dispatch({ type: "User", payload: user });
      dispatch({ type: "Favorite", payload: data });
    }
    getFavorite();
  }, [state]);
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history"));
    if (!history) return;
    if(history.length === 0) return;
    dispatch({ type: "Play", payload: history[0] });
    dispatch({
      type: "Season",
      payload: {
        ...history[0],
        title: history[0].showName,
        image: history[0].showImage,
        timeProgress: history[0]?.timeProgress || 0,
        duration: 42,
      },
    });
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
