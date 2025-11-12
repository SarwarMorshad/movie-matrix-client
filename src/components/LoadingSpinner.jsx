const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-movie-dark">
      <div className="text-center space-y-4">
        <div className="loading-spinner mx-auto"></div>
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
