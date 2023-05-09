import { useParams } from "react-router-dom"

export default function PersonDetail() {
    const { id } = useParams();
    return (

        <div> Person: {id} </div>
    )
}