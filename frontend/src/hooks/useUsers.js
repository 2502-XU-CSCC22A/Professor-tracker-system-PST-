import { useState, useEffect, useCallback } from "react";
import { getProfessors } from "../api/axios";

const useUsers = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProfessors();

      const userData = Array.isArray(data) ? data : (data?.users || data?.data || []);
      setProfessors(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setProfessors([]);
    } finally {
      setLoading(false);
    }
  }, []);

 
  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);


  const refresh = useCallback(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  return { professors, loading, refresh };
};

export default useUsers;