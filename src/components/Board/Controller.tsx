import { Piece, Player, Token } from "../../logic";
import React, { useState } from "react";
import { canMove, possibleMovements } from "../../logic/move";
import { canPlace, possiblePlacements } from "../../logic/place";

import Grid from "./Grid";
import Selector from "./Selector";

enum Action {
  None,
  Place,
  Move,
  Rotate,
}

const DEFAULT_ACTION = Action.None;
const DEFAULT_HIGHLIGHTED = new Set<number>();
const DEFAULT_TOKEN = Token.Blocker;
const DEFAULT_INDEX = -1;

interface ControllerProps {
  readonly cells: Array<Piece | null>;
  readonly hand: Array<Token>;
  readonly player: Player;
  readonly moves: any;
}

const Controller = ({ cells, hand, player, moves }: ControllerProps) => {
  const [action, setAction] = useState(DEFAULT_ACTION);
  const [highlighted, setHighlighted] = useState(DEFAULT_HIGHLIGHTED);
  const [activeToken, setActiveToken] = useState(DEFAULT_TOKEN);
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);

  const transitions = {
    toNone: () => {
      setAction(Action.None);
      setHighlighted(DEFAULT_HIGHLIGHTED);
      setActiveToken(DEFAULT_TOKEN);
      setActiveIndex(DEFAULT_INDEX);
    },
    toPlace: (token: Token) => {
      setAction(Action.Place);
      setHighlighted(possiblePlacements(cells, hand, { player, token }));
      setActiveToken(token);
      setActiveIndex(DEFAULT_INDEX);
    },
    toMove: (index: number) => {
      setAction(Action.Move);
      setHighlighted(possibleMovements(cells, player, index));
      setActiveToken(DEFAULT_TOKEN);
      setActiveIndex(index);
    },
  };

  const onTokenSelect = (token: Token) => transitions.toPlace(token);

  const onCellClick = (index: number) => {
    const p = cells[index];
    if (index !== activeIndex && p && p.player === player) {
      transitions.toMove(index);
    } else if (
      action === Action.Place &&
      canPlace(cells, hand, { player, token: activeToken }, index)
    ) {
      moves.placePiece(activeToken, index);
      transitions.toNone();
    } else if (
      action === Action.Move &&
      canMove(cells, player, activeIndex, index)
    ) {
      moves.movePiece(activeIndex, index);
      transitions.toNone();
    }
  };

  return (
    <div id="interface">
      <Grid cells={cells} highlighted={highlighted} onCellClick={onCellClick} />
      <Selector hand={hand} onTokenSelect={onTokenSelect} />
    </div>
  );
};

export default Controller;