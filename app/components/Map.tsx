'use client';

import { useEffect, useRef } from 'react';

declare global {
	interface Window {
		google: any;
		initMap: () => void;
	}
}

interface MapProps {
	latitude?: number;
	longitude?: number;
	zoom?: number;
	className?: string;
}

export default function Map({
	latitude = 30.0444, // Cairo's latitude
	longitude = 31.2357, // Cairo's longitude
	zoom = 6, // Default zoom level to show more of Egypt
	className = '',
}: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const scriptLoadedRef = useRef(false);

	useEffect(() => {
		if (!scriptLoadedRef.current) {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
			script.async = true;
			script.defer = true;

			window.initMap = () => {
				if (mapRef.current) {
					const map = new window.google.maps.Map(mapRef.current, {
						center: { lat: latitude, lng: longitude },
						zoom: zoom,
						styles: [
							{
								featureType: 'poi',
								elementType: 'labels',
								stylers: [{ visibility: 'off' }],
							},
						],
					});

					new window.google.maps.Marker({
						position: { lat: latitude, lng: longitude },
						map: map,
						animation: window.google.maps.Animation.DROP,
					});
				}
			};

			document.head.appendChild(script);
			scriptLoadedRef.current = true;
		} else if (window.google) {
			// Update map if coordinates change
			const map = new window.google.maps.Map(mapRef.current!, {
				center: { lat: latitude, lng: longitude },
				zoom: zoom,
				styles: [
					{
						featureType: 'poi',
						elementType: 'labels',
						stylers: [{ visibility: 'off' }],
					},
				],
			});

			new window.google.maps.Marker({
				position: { lat: latitude, lng: longitude },
				map: map,
				animation: window.google.maps.Animation.DROP,
			});
		}
	}, [latitude, longitude, zoom]);

	return <div ref={mapRef} className={className} />;
}
