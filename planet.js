var data = {
	mercury: {
		distance_from_sun: 58,      // Distance from the Sun (millions km)
        diameter: 4878,
		axis_spin_time: '59 days',  // Time to spin on axis
		sun_orbit_time: '88 days',  // Time to orbit the Sun
		gravity_rel_to_earth: 0.38, // Gravity (Earth = 1)
		num_of_moons: 0             // Number of satellites
	},
	venus: {
		distance_from_sun: 108,
		diameter: 12104,
		axis_spin_time: '243 days',
		sun_orbit_time: '224 days',
		gravity_rel_to_earth: 0.9,
		num_of_moons: 0
	},
	earth: {
		distance_from_sun: 150,
		diameter: 12756,
		axis_spin_time: '23 hours 56 mins',
		sun_orbit_time: '365.25 days',
		gravity_rel_to_earth: 1,
		num_of_moons: 1
	},
	mars: {
		distance_from_sun: 228,
		diameter: 6794,
		axis_spin_time: '24 hours 37 mins',
		sun_orbit_time: '687 days',
		gravity_rel_to_earth: 0.38,
		num_of_moons: 2
	},
	jupiter: {
		distance_from_sun: 778,
		diameter: 142984,
		axis_spin_time: '9 hours 55 mins',
		sun_orbit_time: '11.86 years',
		gravity_rel_to_earth: 2.64,
		num_of_moons: 66
	},
	saturn: {
		distance_from_sun: 1427,
		diameter: 120536,
		axis_spin_time: '10 hours 39 mins',
		sun_orbit_time: '29 years',
		gravity_rel_to_earth: 1.16,
		num_of_moons: 62
	},
	uranus: {
		distance_from_sun: 2871,
		diameter: 51118,
		axis_spin_time: '17 hours 14 mins',
		sun_orbit_time: '84 years',
		gravity_rel_to_earth: 1.11,
		num_of_moons: 27
	},
	neptune: {
		distance_from_sun: 4497,
		diameter: 49532,
		axis_spin_time: '16 hours 7 mins',
		sun_orbit_time: '164.8 years',
		gravity_rel_to_earth: 1.21,
		num_of_moons: 13
	}
};

exports.getPlanet = function(planetName) {
	return data[planetName];
}