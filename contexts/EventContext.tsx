import { createContext, useContext, useState } from 'react';

type EventData = Record<'images' | 'audio' | 'documents' | 'notes', any>;

const eventContextDefaultValues: any = {
  images: [],
  setImages: () => {},
  audio: [],
  setAudio: () => {},
  documents: [],
  setDocuments: () => {},
  notes: [],
  setNotes: () => {},
  clearState: () => {},
  setAllState: (data: EventData) => {},
};

const EventContext = createContext<any>(eventContextDefaultValues);

const Provider = ({ children }: any) => {
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [audio, setAudio] = useState([]);
  const [notes, setNotes] = useState([]);

  const clearState = () => {
    setImages([]);
    setDocuments([]);
    setAudio([]);
    setNotes([]);
  };

  const setAllState = (data: EventData) => {
    setImages(data.images);
    setDocuments(data.documents);
    setAudio(data.audio);
    setNotes(data.notes);
  };

  return (
    <EventContext.Provider
      value={{
        images,
        setImages,
        documents,
        setDocuments,
        audio,
        setAudio,
        notes,
        setNotes,
        clearState,
        setAllState,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventCxt = () => useContext(EventContext);

export default Provider;
