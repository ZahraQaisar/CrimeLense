import { useState, useCallback, useRef } from 'react';
import { predictionService } from '../services/predictionService';

/**
 * usePrediction — React hook for calling the ML prediction API
 *
 * Usage:
 *   const { predict, result, loading, error, reset } = usePrediction();
 *   await predict({ latitude: 34.05, longitude: -118.24, hour: 22, month: 10 });
 */
const usePrediction = () => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const predict = useCallback(async (inputs) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictionService.predict(inputs);
      setResult(data);
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Prediction failed. Please check your connection.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { predict, result, loading, error, reset };
};

export default usePrediction;
