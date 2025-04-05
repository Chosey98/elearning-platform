'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

declare global {
	interface Window {
		google: any;
		initGoogleMaps?: () => void;
	}
}

interface AddressPickerProps {
	value: string;
	onChange: (address: string, latitude?: number, longitude?: number) => void;
	className?: string;
	required?: boolean;
}

export default function AddressPicker({
	value,
	onChange,
	className = '',
	required = false,
}: AddressPickerProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [scriptLoaded, setScriptLoaded] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (!window.google) {
			// Define the callback function
			window.initGoogleMaps = () => {
				setScriptLoaded(true);
			};

			// Create and append the script tag
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);

			return () => {
				document.head.removeChild(script);
				if (window.initGoogleMaps) {
					delete window.initGoogleMaps;
				}
			};
		} else {
			setScriptLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (scriptLoaded && inputRef.current) {
			const autocomplete = new window.google.maps.places.Autocomplete(
				inputRef.current,
				{
					types: ['geocode'],
					componentRestrictions: { country: 'eg' },
					fields: [
						'formatted_address',
						'geometry',
						'name',
						'address_components',
					],
				}
			);

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				if (place.geometry) {
					onChange(
						place.formatted_address,
						place.geometry.location.lat(),
						place.geometry.location.lng()
					);
					toast({
						title: 'Address Selected',
						description: 'Location has been successfully set',
					});
				} else {
					onChange(place.name);
				}
			});
		}
	}, [scriptLoaded, onChange, toast]);

	return (
		<div className={`relative ${className}`}>
			<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
			<Input
				ref={inputRef}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Enter an address..."
				className="pl-10"
				required={required}
			/>
		</div>
	);
}
