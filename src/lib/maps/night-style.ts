export const NIGHT_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0a0f1e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0f1e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1f35" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212945" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e2540" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#080d1a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1f35" }],
  },
];
