import React, { JSX } from 'react';
import './App.css';
import { MidiNote } from './midi';
import { Chord, chords } from './chords';
import _ from 'lodash';

function App(): JSX.Element {
  return (
    <div className="App">
      <Chords sameRootRunsDown={true}/>
    </div>
  );
}

function Chords(props: {sameRootRunsDown: boolean}): JSX.Element {
  const buttons: JSX.Element[] = [];
  _.range(60, 72).map((rootMidiValue, i) => {
    chords.map((chord, j) => {
      buttons.push(
        <ChordButton
          key={1}
          rootMidiValue={rootMidiValue}
          chord={chord}
          preferSharp={true}
          column={props.sameRootRunsDown ? i + 1 : j + 1}
          row={props.sameRootRunsDown ? j + 1 : i + 1}
          />);
    });
  });
  
  return <div className="chord-grid" style={{display: "grid"}}>
      {buttons}
  </div>;
}

function ChordButton(props: {
  rootMidiValue: number,
  chord: Chord,
  preferSharp: boolean,
  column: number,
  row: number,
}): JSX.Element {
  const midiNote = new MidiNote(props.rootMidiValue);
  const rootString = midiNote.rootString(props.preferSharp);
  const text = `${rootString}${'\u200B'}${props.chord.abbreviation}`;

  function mouseDown(): void {
    console.log(`Down: ${rootString} ${props.chord.name}`);
    console.log(`Should play notes: ${midiNote.withChord(props.chord)}`);
  }

  function mouseUp(): void {
  }

  return (
    <button
      className="chord-button"
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      style={{
        gridColumnStart: props.column,
        gridRowStart: props.row,
      }}>
      <span className='button-text'>
        {text}
      </span>
    </button>);
}

export default App;
