import { useState, useEffect } from "react";

export default function useStats(){
    const [stats,setStats] = useState(null);
    const [error,setError] = useState(null);
    useEffect(()=>{
        let isMounted = true;
        async function fetchStats(){
            try{
            const res = await fetch("http://localhost:3001/api/admin/getStats",{credentials:"include"})
            const data = await res.json()

        if (isMounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Something went wrong!");
        }
      }
    }
    fetchStats();
    return () => (isMounted = false);
  }, []);

  return { stats, error };
}
