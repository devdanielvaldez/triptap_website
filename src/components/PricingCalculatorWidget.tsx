import React, { useState, useEffect } from 'react';
import { DollarSign, Image, Video, Download, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';
import { pricingConfigService, PricingConfig } from '../services/pricingConfigService';

interface PricingCalculatorWidgetProps {
  theme?: 'dark' | 'light';
  companyName?: string;
  logoUrl?: string | null;
  onDownloadComplete?: () => void;
}

export default function PricingCalculatorWidget({
  theme = 'dark',
  companyName = 'TripTap',
  logoUrl = null,
  onDownloadComplete,
}: PricingCalculatorWidgetProps) {
  const [calculatorData, setCalculatorData] = useState({
    advertiserName: '',
    videoViews: '',
    imagePresentations: '',
    durationDays: '30'
  });
  
  const [pricesLoaded, setPricesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priceConfig, setPriceConfig] = useState({
    videoCost: 0.001,
    imageCost: 0.002
  });

  useEffect(() => {
    // Cargar la configuración de precios cuando el componente se monta
    const loadPricingConfig = async () => {
      try {
        setIsLoading(true);
        const data = await pricingConfigService.getPricingConfig();
        
        setPriceConfig({
          videoCost: data.videoCostPerView,
          imageCost: data.imageCostPerPresentation
        });
        setPricesLoaded(true);
      } catch (error) {
        console.error('Error cargando configuración de precios:', error);
        // Mantener los valores predeterminados en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    loadPricingConfig();
  }, []);

  const handleCalculatorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    const videoTotal = Number(calculatorData.videoViews) * priceConfig.videoCost;
    const imageTotal = Number(calculatorData.imagePresentations) * priceConfig.imageCost;
    return {
      videoTotal,
      imageTotal,
      total: videoTotal + imageTotal
    };
  };

  const generateExcel = () => {
    const totals = calculateTotals();
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      [`Cotización de Anuncios - ${companyName}`],
      [''],
      ['Anunciante:', calculatorData.advertiserName],
      ['Fecha de cotización:', new Date().toLocaleDateString()],
      ['Duración estimada:', `${calculatorData.durationDays} días`],
      [''],
      ['Detalles de la Cotización'],
      ['Tipo', 'Cantidad', 'Precio Unitario', 'Total'],
      ['Vistas de Video', calculatorData.videoViews, `$${priceConfig.videoCost}`, `$${totals.videoTotal.toFixed(2)}`],
      ['Presentaciones de Imagen', calculatorData.imagePresentations, `$${priceConfig.imageCost}`, `$${totals.imageTotal.toFixed(2)}`],
      [''],
      ['Total Estimado:', '', '', `$${totals.total.toFixed(2)}`],
      [''],
      ['Notas:'],
      ['- Los precios están en USD'],
      ['- Esta cotización es una estimación y puede variar según el rendimiento real'],
      ['- Los precios no incluyen impuestos aplicables']
    ]);

    const wscols = [
      {wch: 25}, {wch: 15}, {wch: 15}, {wch: 15}
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotización');
    XLSX.writeFile(workbook, `cotizacion-${calculatorData.advertiserName.replace(/\s+/g, '-')}.xlsx`);
    
    // Llamar al callback después de la descarga
    if (onDownloadComplete) {
      onDownloadComplete();
    }
  };

  // Clases CSS basadas en el tema
  const styles = {
    bg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    inputBg: theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100',
    summaryBg: theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-100',
  };

  return (
    <div className={`widget-root ${styles.bg} ${styles.text} rounded-xl border ${styles.border} shadow-lg`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            {logoUrl && <img src={logoUrl} alt={companyName} className="h-6 mr-2" />}
            Calculadora de Cotización
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-t-2 border-b-2 border-[#4EBEFF] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-t-2 border-b-2 border-[#EF5AFF] rounded-full animate-spin-slow"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label className={`block text-sm font-medium ${styles.subtext} mb-2`}>
                  Nombre del Anunciante
                </label>
                <input
                  type="text"
                  name="advertiserName"
                  value={calculatorData.advertiserName}
                  onChange={handleCalculatorInputChange}
                  className={`block w-full px-4 py-2 ${styles.inputBg} border ${styles.border} rounded-lg focus:ring-2 focus:ring-[#4EBEFF] focus:outline-none`}
                  placeholder="Ejemplo: Empresa S.A."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${styles.subtext} mb-2`}>
                  Duración Estimada (días)
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={calculatorData.durationDays}
                  onChange={handleCalculatorInputChange}
                  className={`block w-full px-4 py-2 ${styles.inputBg} border ${styles.border} rounded-lg focus:ring-2 focus:ring-[#4EBEFF] focus:outline-none`}
                  placeholder="30"
                  min="1"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${styles.subtext} mb-2`}>
                  Vistas de Video Estimadas
                </label>
                <input
                  type="number"
                  name="videoViews"
                  value={calculatorData.videoViews}
                  onChange={handleCalculatorInputChange}
                  className={`block w-full px-4 py-2 ${styles.inputBg} border ${styles.border} rounded-lg focus:ring-2 focus:ring-[#4EBEFF] focus:outline-none`}
                  placeholder="1000"
                  min="0"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${styles.subtext} mb-2`}>
                  Presentaciones de Imagen Estimadas
                </label>
                <input
                  type="number"
                  name="imagePresentations"
                  value={calculatorData.imagePresentations}
                  onChange={handleCalculatorInputChange}
                  className={`block w-full px-4 py-2 ${styles.inputBg} border ${styles.border} rounded-lg focus:ring-2 focus:ring-[#4EBEFF] focus:outline-none`}
                  placeholder="1000"
                  min="0"
                />
              </div>
              
              <div className="col-span-full">
                <label className={`block text-sm font-medium ${styles.subtext} mb-3`}>
                  Precios Actuales
                </label>
                <div className={`grid grid-cols-2 gap-4 p-3 ${styles.summaryBg} rounded-lg`}>
                  <div className="flex items-center">
                    <Video className="text-[#4EBEFF] mr-2 w-5 h-5" />
                    <div>
                      <div className={`text-xs ${styles.subtext}`}>Costo por Vista de Video</div>
                      <div>${priceConfig.videoCost}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Image className="text-[#EF5AFF] mr-2 w-5 h-5" />
                    <div>
                      <div className={`text-xs ${styles.subtext}`}>Costo por Presentación de Imagen</div>
                      <div>${priceConfig.imageCost}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Cotización */}
            <div className={`mt-8 ${styles.summaryBg} p-4 rounded-lg border ${styles.border}`}>
              <h3 className="text-lg font-medium mb-4">Resumen de Cotización</h3>
              <div className="space-y-3">
                {Number(calculatorData.videoViews) > 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`${styles.subtext} text-sm`}>Vistas de Video</div>
                      <div>{Number(calculatorData.videoViews).toLocaleString()} vistas x ${priceConfig.videoCost}</div>
                    </div>
                    <div className="font-medium">
                      ${(Number(calculatorData.videoViews) * priceConfig.videoCost).toFixed(2)}
                    </div>
                  </div>
                )}
                
                {Number(calculatorData.imagePresentations) > 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`${styles.subtext} text-sm`}>Presentaciones de Imagen</div>
                      <div>{Number(calculatorData.imagePresentations).toLocaleString()} presentaciones x ${priceConfig.imageCost}</div>
                    </div>
                    <div className="font-medium">
                      ${(Number(calculatorData.imagePresentations) * priceConfig.imageCost).toFixed(2)}
                    </div>
                  </div>
                )}
                
                <div className={`pt-3 mt-2 border-t ${styles.border} flex justify-between items-center`}>
                  <div className="font-medium text-lg">Total Estimado</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] bg-clip-text text-transparent">
                    ${calculateTotals().total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={generateExcel}
                disabled={!calculatorData.advertiserName || (Number(calculatorData.videoViews) === 0 && Number(calculatorData.imagePresentations) === 0)}
                className="px-6 py-2 bg-gradient-to-r from-[#4EBEFF] to-[#EF5AFF] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Download className="mr-2 w-4 h-4" />
                Descargar Cotización
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}