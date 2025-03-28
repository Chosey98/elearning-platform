'use client';

import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countries';

interface PhoneInputProps {
	value: {
		dialCode: string;
		number: string;
	};
	onChange: (value: { dialCode: string; number: string }) => void;
	className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
	const [dialCode, setDialCode] = useState(value.dialCode || '+1');
	const [number, setNumber] = useState(value.number || '');

	// Find initial country based on dial code
	const initialCountry = countries.find(
		(country) => country.dial_code === dialCode
	);
	const [selectedCountry, setSelectedCountry] = useState(
		initialCountry?.code || 'US'
	);

	const handleCountryChange = (value: string) => {
		// Extract the country code and dial code from the combined value
		const [countryCode, dialCode] = value.split('|');
		setSelectedCountry(countryCode);
		setDialCode(dialCode);
		onChange({ dialCode, number });
	};

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newNumber = e.target.value.replace(/[^0-9]/g, '');
		setNumber(newNumber);
		onChange({ dialCode, number: newNumber });
	};

	return (
		<div className={`flex w-full ${className}`}>
			<Select
				value={`${selectedCountry}|${dialCode}`}
				onValueChange={handleCountryChange}
			>
				<SelectTrigger className="w-[110px] border-r-0 rounded-r-none">
					<SelectValue placeholder="..." />
				</SelectTrigger>
				<SelectContent className="max-h-[300px]">
					{countries.map((country) => (
						<SelectItem
							key={country.code}
							value={`${country.code}|${country.dial_code}`}
						>
							<div className="flex items-center gap-2">
								<span>{country.code}</span>
								<span>{country.dial_code}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Input
				type="tel"
				value={number}
				onChange={handleNumberChange}
				className="rounded-l-none"
				placeholder="Phone number"
			/>
		</div>
	);
}
