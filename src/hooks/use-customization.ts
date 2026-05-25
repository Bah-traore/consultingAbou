import { useEffect } from 'react';
import { create } from 'zustand';
import { API_ENDPOINTS, apiGet, fixImageUrl } from '@/lib/api';

interface CustomizationStore {
  customization: any | null;
  isLoading: boolean;
  error: string | null;
  fetchCustomization: () => Promise<void>;
}

export const useCustomization = create<CustomizationStore>((set) => ({
  customization: null,
  isLoading: false,
  error: null,
  
    fetchCustomization: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const data = await apiGet<any>(API_ENDPOINTS.CUSTOMIZATION.GET);
        console.log('Données de personnalisation reçues:', data);
        
        // Corriger les URLs des images de la personnalisation
        if (data) {
          const imageFields = [
            'hero_background_image',
            'hero_image',
            'about_image',
            'hero_image_badge_icon',
            'testimonials_image',
            'logo'
          ];
          for (const field of imageFields) {
            if (data[field]) {
              data[field] = fixImageUrl(data[field]);
            }
          }
        }
        
        set({ customization: data, isLoading: false });
      } catch (err) {
        console.error('Erreur lors du chargement de la personnalisation:', err);
        set({ 
          error: err instanceof Error ? err.message : 'Erreur de chargement',
          isLoading: false 
        });
      }
    },
}));

// Hook pour appliquer les styles personnalisés
export function useApplyCustomStyles() {
  const { customization } = useCustomization();
  
  useEffect(() => {
    if (!customization) return;
    
    // Appliquer les variables CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customization.primary_color);
    root.style.setProperty('--secondary-color', customization.secondary_color);
    root.style.setProperty('--accent-color', customization.accent_color);
    root.style.setProperty('--background-color', customization.background_color);
    root.style.setProperty('--text-color', customization.text_color);
  }, [customization]);
}
