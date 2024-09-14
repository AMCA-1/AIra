import { createContext, useState } from "react";
import run from "../config/config";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input , setInput] = useState("");//to save the input data
    const [recentPrompt, setrecentPrompt] = useState("");//when we will click on send button input field data will be stored here
    const [prevPrompts , setprevPrompts] = useState([]);//to store all the input history and show in the recent section
    const [showResult , setshowResult] = useState(false);//once its true this will hide the greet text and add the answer on the field
    const [loading,setLoading] = useState(false);//it will display loading animation oncethe showresult is true
    const [resultData,setresultData] = useState("")//this will display our result on webpage

    //to delay para
    const delayPara = (index,nextWord)  =>{
        setTimeout(function (){
            setresultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = () =>{
        setLoading(false);
        setshowResult(false);
    }


    const onSent = async (prompt) => {
        setresultData("");//reset our result data so that our previous response is removed froma state variable
        setLoading(true);//to display some loading animation on our screen
        setshowResult(true);
        let response;
        if(prompt!==undefined){
            response = await run(prompt);
            setrecentPrompt(prompt)
        }else{
            setprevPrompts(prev=>[...prev,input]);
            setrecentPrompt(input);
            response = await run(input); 
        }
        // setrecentPrompt(input);
        // setprevPrompts(prev=>[...prev,input])
        // const response = await run(input);//our response will be stored in this response variable
        let responseArray = response.split("**");
        let newResponse;
        for(let i=0;i<responseArray.length;i++){
            if(i==0 || i%2!==1){
                newResponse+= responseArray[i];

            }else{
                newResponse+="<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        // setresultData(newResponse2)
        let newResponseArray = newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord);
        }
        setLoading(false);//to hide the loading animation
        setInput("");
    }
    //onSent("What is ReactJS ? ")

    const contextValue = {
        prevPrompts,
        setprevPrompts,
        onSent,
        setrecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;