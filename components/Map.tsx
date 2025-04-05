'use client';

import { useEffect, useRef, useState } from 'react';

interface MapProps {
	latitude: number;
	longitude: number;
	zoom?: number;
	className?: string;
}

declare global {
	interface Window {
		google: any;
		initMap?: () => void;
	}
}

export default function Map({
	latitude,
	longitude,
	zoom = 15,
	className = '',
}: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const [scriptLoaded, setScriptLoaded] = useState(false);

	useEffect(() => {
		if (!window.google) {
			// Define the callback function
			window.initMap = () => {
				setScriptLoaded(true);
			};

			// Create and append the script tag
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);

			return () => {
				document.head.removeChild(script);
				if (window.initMap) {
					delete window.initMap;
				}
			};
		} else {
			setScriptLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (scriptLoaded && mapRef.current) {
			// Create the map
			const map = new window.google.maps.Map(mapRef.current, {
				center: { lat: latitude, lng: longitude },
				zoom: zoom,
				disableDefaultUI: true,
				zoomControl: true,
				streetViewControl: true,
				fullscreenControl: true,
				styles: [
					{
						featureType: 'poi',
						elementType: 'labels',
						stylers: [{ visibility: 'off' }],
					},
				],
			});

			// Add a marker
			new window.google.maps.Marker({
				position: { lat: latitude, lng: longitude },
				map: map,
				animation: window.google.maps.Animation.DROP,
			});
		}
	}, [scriptLoaded, latitude, longitude, zoom]);

	return (
		<div
			ref={mapRef}
			className={`w-full h-[300px] rounded-lg ${className}`}
		/>
	);
}
