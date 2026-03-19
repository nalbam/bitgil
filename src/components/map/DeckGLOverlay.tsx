"use client";

import { useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import type { DeckProps } from "@deck.gl/core";

export function DeckGLOverlay(props: DeckProps) {
  const map = useMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally created once; updated via setProps below
  const overlay = useMemo(() => new GoogleMapsOverlay(props), []);

  useEffect(() => {
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, overlay]);

  overlay.setProps(props);
  return null;
}
