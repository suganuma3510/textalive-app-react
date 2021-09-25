import React, { useCallback, useState, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
import { PlayerSeekbar } from "textalive-react-api";

export const PlayerControl = ({
  disabled,
  player,
}: {
  disabled: any;
  player: any;
}) => {
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const listener = {
      onPlay: () => setStatus("play"),
      onPause: () => setStatus("pause"),
      onStop: () => setStatus("stop"),
    };
    player.addListener(listener);
    return () => player.removeListener(listener);
  }, [player]);

  const handlePlay = useCallback(
    () => player && player.requestPlay(),
    [player]
  );
  const handlePause = useCallback(
    () => player && player.requestPause(),
    [player]
  );
  const handleStop = useCallback(
    () => player && player.requestStop(),
    [player]
  );

  return (
    <div className="control">
      <Button
        inverted
        circular
        color={status !== "play" ? "orange" : "yellow"}
        size="big"
        icon
        onClick={status !== "play" ? handlePlay : handlePause}
        disabled={disabled}
      >
        <Icon name={status !== "play" ? "play" : "pause"} />
      </Button>
      <Button
        inverted
        circular
        color="green"
        size="big"
        icon
        onClick={handleStop}
        disabled={disabled || status === "stop"}
      >
        <Icon name="stop" />
      </Button>
      <div className="seekbar">
        <PlayerSeekbar player={!disabled && player} />
      </div>
    </div>
  );
};
