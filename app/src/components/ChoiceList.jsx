import React, { useState, useEffect, useReducer } from 'react'
import Choice from './Choice'

function ChoiceList({editable, onChangeCallback}) {
  // const [options, setOptions] = useState([])

  useEffect(() => {
    onChangeCallback(options)
  })

  const [options, setOptions] = useReducer((options, { action, index, optionName }) => {
    switch (action) {
      case "remove":
        return options.filter((_, i) => i !== index)
      case "add":
        return [...options, { optionName:"" }]
      default:
        let newOptions = options
        newOptions[index] = {
          ...options[index],
          optionName
        }
        return newOptions
    }
    // if (optionName===null){
    //   return myArray.filter((_, i) => i !== index)
    // } else {
      
    // }
  }, []);

  // const updateOptions = (index, optionName) => {
  //   let newOptions = options
  //   console.log('optionName', index, optionName)
  //   if (optionName===null){
  //     console.log('insie null', [...newOptions.filter((option,i)=>i!==index)])
  //     setOptions([...newOptions.filter((option,i)=>i!==index)])
  //   } else {
  //     newOptions[index] = {
  //       ...options[index],
  //       optionName
  //     }
  //     setOptions(newOptions)
  //   }
    
  // }

  // const deleteOption = (index) =>{
  //   setOptions(options.reduce((acc, option, i)=>{
  //     if (index!==i){
  //       acc.push({...option})
  //     }
  //     return acc
  //   },[]))
  // }

  // const addOption = () =>{
  //   setOptions([...options, { optionName:"" }])
  // }
  console.log('options', options)
  return (
    <div>
      {editable&&<button onClick={()=>setOptions({action:"add"})}> + </button>}
      <ul>
        {options.map((option, index)=>{
          return <Choice 
            key={`choiceoption${option.id}${index}`}
            editable 
            deleteOption={
              (index===options.length-1)
              ? ()=>setOptions({action:"remove", index})
              : undefined
            } 
            onChangeCallback={(optionName)=>setOptions({index, optionName})}
          />
        })
        }
      </ul> 
    </div>
  );

}

export default ChoiceList;
