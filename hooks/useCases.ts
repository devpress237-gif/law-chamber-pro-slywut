
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Case, Hearing, Document } from '../types';
import { mockCases } from '../data/mockData';

const CASES_STORAGE_KEY = 'cases_data';

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const storedCases = await AsyncStorage.getItem(CASES_STORAGE_KEY);
      if (storedCases) {
        const parsedCases = JSON.parse(storedCases);
        setCases(parsedCases);
      } else {
        // Initialize with mock data
        setCases(mockCases);
        await AsyncStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(mockCases));
      }
    } catch (error) {
      console.log('Error loading cases:', error);
      setCases(mockCases);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCases = async (updatedCases: Case[]) => {
    try {
      await AsyncStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updatedCases));
      setCases(updatedCases);
    } catch (error) {
      console.log('Error saving cases:', error);
    }
  };

  const addCase = async (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    const caseWithId: Case = {
      ...newCase,
      id: 'case_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedCases = [...cases, caseWithId];
    await saveCases(updatedCases);
    return caseWithId;
  };

  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    const updatedCases = cases.map(c => 
      c.id === caseId 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    );
    await saveCases(updatedCases);
  };

  const deleteCase = async (caseId: string) => {
    const updatedCases = cases.filter(c => c.id !== caseId);
    await saveCases(updatedCases);
  };

  const addHearing = async (caseId: string, hearing: Omit<Hearing, 'id' | 'createdAt' | 'updatedAt'>) => {
    const hearingWithId: Hearing = {
      ...hearing,
      id: 'hearing_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCases = cases.map(c => 
      c.id === caseId 
        ? { 
            ...c, 
            hearings: [...c.hearings, hearingWithId],
            updatedAt: new Date()
          }
        : c
    );
    await saveCases(updatedCases);
    return hearingWithId;
  };

  const addDocument = async (caseId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const documentWithId: Document = {
      ...document,
      id: 'doc_' + Date.now(),
      uploadedAt: new Date(),
    };

    const updatedCases = cases.map(c => 
      c.id === caseId 
        ? { 
            ...c, 
            documents: [...c.documents, documentWithId],
            updatedAt: new Date()
          }
        : c
    );
    await saveCases(updatedCases);
    return documentWithId;
  };

  const getTodayHearings = () => {
    const today = new Date();
    return cases.flatMap(c => 
      c.hearings.filter(h => {
        const hearingDate = new Date(h.date);
        return hearingDate.toDateString() === today.toDateString();
      }).map(h => ({ ...h, case: c }))
    );
  };

  const getTomorrowHearings = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return cases.flatMap(c => 
      c.hearings.filter(h => {
        const hearingDate = new Date(h.date);
        return hearingDate.toDateString() === tomorrow.toDateString();
      }).map(h => ({ ...h, case: c }))
    );
  };

  const getCasesByStatus = (status: Case['status']) => {
    return cases.filter(c => c.status === status);
  };

  return {
    cases,
    isLoading,
    addCase,
    updateCase,
    deleteCase,
    addHearing,
    addDocument,
    getTodayHearings,
    getTomorrowHearings,
    getCasesByStatus,
    refreshCases: loadCases,
  };
};
