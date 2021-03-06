import React from 'react';
import './App.css';
import Piece from './components/Piece';
import lo from 'lodash';

export default class App extends React.Component {
  constructor(){
    super();
    this.select = this.select.bind(this);
    this.playHistory = this.playHistory.bind(this);
    this.startingBoard = [
        ['BR' , 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
        ['BP' , 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
        ['-' , '-', '-', '-', '-', '-', '-', '-'],
        ['-' , '-', '-', '-', '-', '-', '-', '-'],
        ['-' , '-', '-', '-', '-', '-', '-', '-'],
        ['-' , '-', '-', '-', '-', '-', '-', '-'],
        ['WP' , 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
        ['WR' , 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
    ];

    this.state = {
      selected: null,
      history: [],
      rows : lo.cloneDeep(this.startingBoard),
    };
  }

  playHistory(ev){
    let mark = ev.currentTarget.attributes.mark.value;
    let rows = lo.cloneDeep(this.startingBoard);
    for(let i = 0; i <= mark; i++){
      let move = this.state.history[i];
      rows = this.executeMove(rows, move.from, move.to)  
    }
    this.setState({rows});
  }

  getId(row, col){
    return String.fromCharCode(65 + col) + String.fromCharCode((7-row) + 49) ;
  }

  decodePosition(id){
    let col = id.charCodeAt(0) - 65;
    let row = 7-(id.charCodeAt(1) - 49);
    return [row, col];
  }

  executeMove(rows, from, to){
    let [row1, col1] = this.decodePosition(from);
    let [row2, col2] = this.decodePosition(to);

    rows[row2][col2] = rows[row1][col1];
    rows[row1][col1] = '-';

    return rows;
  }

  select(ev){
    let rows = this.state.rows;
    let history = this.state.history;
    let id = ev.currentTarget.id;
    let [row2, col2] = this.decodePosition(id);
    let target = rows[row2][col2];

    if(id === this.state.selected){
      this.setState({selected: null});
    }
    else if(this.state.selected){
      let [row1, col1] = this.decodePosition(this.state.selected);

      let initiator = rows[row1][col1];

      if(target !== '-'){
        let targetColor = target[0];
        let initiatorColor = initiator[0];
        if(targetColor === initiatorColor){ //invalid move
          return;
        }
      }

      let move = { from: this.state.selected, to: id};
      history.push(move);
      rows = this.executeMove(rows, move.from, move.to);
      this.setState({selected: null, rows, history});
    }
    else if(target === '-'){
      return;
    }
    else {
      this.setState({selected: id});
    }
  }


  render() {
    const Cell = (props) => {
      let id = this.getId(props.rownum, props.colnum);
      let classList = 'cell';

      if(id === this.state.selected){
        classList += ' cell-selected';
      }
      let sqNum = (props.rownum * 7 ) + props.colnum;
      if((sqNum % 2) === 0){
        classList += ' cell-dark';
      }
      else{
        classList += ' cell-light';
      }

      return (
        <div 
           className={classList} 
           id={id} 
           onClick={this.select}
        >
          <Piece code={props.piece}/>
        </div>
      );
    };

    const columns = [ '-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return (
      <div className="App">
        <div className="App-sidebar">
          History:
          <div>
              <hr/>
              <div
                mark={-1}
                onClick={this.playHistory}
              >
                -. &nbsp;
                open
                <hr/>
              </div>
 
            {this.state.history.map((move, moveno) =>
              <div
                key={"move_" + moveno}
                mark={moveno}
                onClick={this.playHistory}
              >
                {moveno + 1}. &nbsp;
                {move.from} -> {move.to}
                <hr/>
              </div>
            )}
          </div>
        </div>
        <div className="App-body">
          <div>
            {columns.map((label) =>
              <div className="cell cell-info">{label}</div>
            )}
          </div>
          {this.state.rows.map((row, rownum) =>
            <div key={"row_" + rownum}>
              <div className="cell cell-info">{8-rownum}</div>
              {row.map((col, colnum) => 
                <Cell
                  key={"r_" + rownum + "c_" + colnum}
                  rownum={rownum}
                  colnum={colnum}
                  piece={col}
                />
              )}
            </div>
          )}

          <div style={{margin:20}}>&nbsp;</div>

          {!this.state.selected &&
            <div> - </div>
          }
          {this.state.selected &&
            <div>
              {this.state.selected} -> 
            </div>
          }
 
        </div>
      </div>
    );
  }
}

