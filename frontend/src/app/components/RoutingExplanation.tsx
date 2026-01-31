import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Info, Zap, Shield } from 'lucide-react';

interface RoutingExplanationProps {
  routingExplanation?: {
    routing_decision: string;
    consistency_guarantee: string;
    specialists_selected: string[];
    total_specialists: number;
    routing_reasons: string[];
    deterministic_signals: {
      file_characteristics: {
        size_mb: number;
        size_category: string;
        bitrate_category: string;
        quality_band: string;
        complexity: string;
      };
      filename_analysis: {
        has_compressed_keywords: boolean;
        has_hd_keywords: boolean;
        has_mobile_keywords: boolean;
        has_social_keywords: boolean;
      };
      file_format: string;
    };
    routing_logic: string;
  };
}

export function RoutingExplanation({ routingExplanation }: RoutingExplanationProps) {
  if (!routingExplanation) {
    return null;
  }

  const { 
    routing_decision, 
    consistency_guarantee, 
    specialists_selected, 
    routing_reasons, 
    deterministic_signals 
  } = routingExplanation;

  const getSpecialistIcon = (specialist: string) => {
    if (specialist.includes('BG')) return '🎯';
    if (specialist.includes('CM')) return '📦';
    if (specialist.includes('LL')) return '🌙';
    if (specialist.includes('AV')) return '🎵';
    if (specialist.includes('RR')) return '📐';
    if (specialist.includes('TM')) return '⏱️';
    return '🤖';
  };

  const getSpecialistDescription = (specialist: string) => {
    if (specialist.includes('BG')) return 'Background Analysis';
    if (specialist.includes('CM')) return 'Compression Detection';
    if (specialist.includes('LL')) return 'Low-Light Analysis';
    if (specialist.includes('AV')) return 'Audio-Visual Sync';
    if (specialist.includes('RR')) return 'Resolution Consistency';
    if (specialist.includes('TM')) return 'Temporal Analysis';
    return 'Specialist Model';
  };

  return (
    <Card className="mt-6 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Shield className="h-5 w-5" />
          Deterministic Routing Explanation
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            {routing_decision}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Consistency Guarantee */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">Forensic Consistency</p>
            <p className="text-sm text-green-700">{consistency_guarantee}</p>
          </div>
        </div>

        {/* Selected Specialists */}
        <div>
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Models Selected ({specialists_selected.length} specialists)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specialists_selected.map((specialist, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-2 bg-white rounded border border-blue-200"
              >
                <span className="text-lg">{getSpecialistIcon(specialist)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{specialist}</p>
                  <p className="text-xs text-gray-600">{getSpecialistDescription(specialist)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routing Reasons */}
        <div>
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Why These Models Were Selected
          </h4>
          <div className="space-y-2">
            {routing_reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-blue-800">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deterministic Signals */}
        <div>
          <h4 className="font-medium text-blue-900 mb-3">Deterministic Signals Detected</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Characteristics */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">File Characteristics</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <Badge variant="secondary">{deterministic_signals.file_characteristics.size_mb}MB ({deterministic_signals.file_characteristics.size_category})</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bitrate:</span>
                  <Badge variant="secondary">{deterministic_signals.file_characteristics.bitrate_category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <Badge variant="secondary">{deterministic_signals.file_characteristics.quality_band}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Complexity:</span>
                  <Badge variant="secondary">{deterministic_signals.file_characteristics.complexity}</Badge>
                </div>
              </div>
            </div>

            {/* Filename Analysis */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Filename Indicators</p>
              <div className="space-y-1 text-sm">
                {Object.entries(deterministic_signals.filename_analysis).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-gray-600 capitalize">
                      {key.replace('has_', '').replace('_', ' ')}: {value ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600">Format: {deterministic_signals.file_format}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Routing Logic */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Routing Logic:</span> {routingExplanation.routing_logic}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RoutingExplanation;