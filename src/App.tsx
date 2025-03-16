import React from 'react';
import './App.css';
import { MidiNote } from './midi';
import { Chord, chords } from './chords';

function App() {
  return (
    <div className="App">
      <ChordButton rootMidiValue={60} chord={chords[4]} preferSharp={true}/>
      <ChordButton rootMidiValue={61} chord={chords[4]} preferSharp={true}/>
    </div>
  );
}

function ChordButton(props: { rootMidiValue: number, chord: Chord, preferSharp: boolean }) {
  const midiNote = new MidiNote(props.rootMidiValue);
  const rootString = midiNote.rootString(props.preferSharp);
  const text = `${rootString}${props.chord.abbreviation}`;

  function mouseDown() {
    console.log(`Down: ${rootString} ${props.chord.name}`);
    console.log(`Should play notes: ${midiNote.withChord(props.chord)}`);
  }

  function mouseUp() {
  }

  return <button onMouseDown={mouseDown} onMouseUp={mouseUp}>
    {text}
  </button>;
}

export default App;
