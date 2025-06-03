const LocationMap = ({ location }) => {
  const { latitude, longitude, address } = location;

  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;&output=embed`;

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white p-4 mt-5">
      <h2 className="text-lg font-semibold mb-4">Location: {address}</h2>
      <div className="w-full h-64">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-md w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;