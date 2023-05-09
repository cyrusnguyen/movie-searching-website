import { useParams } from "react-router-dom"
import React from "react"

export default function MovieDetail (){
    const { id } = useParams();
    return (
        <React.Fragment>
            Movie: { id } 
        </React.Fragment>
    )
}