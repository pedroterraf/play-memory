import { supabase } from "../../helpers/superbaseClient";
import { useEffect, useState } from "react";
import Item from "../Item/Item";


const Ranking = () => {
    const [ranking, setRanking] = useState([])

    const callSupabase = async () => {
        const {data} = await supabase.from('ranking').select('*').order('score', {ascending: false})
        setRanking(data)
    }

    useEffect(() => {
        callSupabase()
    },[])

    return ( 
        <div className="content">
            {
                ranking.map((item, index) => (
                    <Item 
                        key={index}
                        name={item.name}
                        score={item.score}
                        index={index}
                    />
                ))
            }
        </div>
    );
}
 
export default Ranking;