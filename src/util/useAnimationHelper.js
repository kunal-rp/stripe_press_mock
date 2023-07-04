import React, { useState, useEffect } from "react";

export default function useAnimationHelper() {
	const [startPix, setStartPix] = useState(0);
	const [size, setSize] = useState(0);
	const [per, setPer] = useState(0);

	const [active, setActive] = useState(false);

	function setPercentage() {
		var currentPixelYScroll = document.documentElement.scrollTop;

		if (
			currentPixelYScroll > startPix &&
			currentPixelYScroll < startPix + size
		) {
			setActive(true);
			setPer((currentPixelYScroll - startPix) / size);
		} else {
			setActive(false);
		}
	}

	useEffect(() => {
		window.addEventListener("scroll", setPercentage);

		return () => window.removeEventListener("scroll", setPercentage);
	}, [startPix, size]);

	return [active, per, setStartPix, setSize];
}
