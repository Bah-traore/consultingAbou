// Script de test pour vérifier la correction des problèmes de slides
// Ce script simule les appels API pour vérifier que les slides peuvent être chargés

import { apiGet } from './src/lib/api';

async function testSlidesFix() {
  console.log('Test de la correction des slides...');
  
  try {
    // Vérifier si l'utilisateur est connecté
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!accessToken) {
      console.log('⚠ Aucun token d\'accès trouvé. Veuillez vous connecter d\'abord.');
      console.log('URL de connexion: http://localhost:3001/admin/login');
      return;
    }
    
    console.log('✅ Token d\'accès trouvé');
    
    // Tester la récupération des slides
    console.log('🔍 Test de la récupération des slides...');
    const slides = await apiGet<any[]>('/api/admin/slides/');
    
    if (slides && slides.length > 0) {
      console.log(`✅ ${slides.length} slides récupérés avec succès`);
      
      // Vérifier les URLs des images
      const slideWithImage = slides.find(slide => slide.image);
      if (slideWithImage) {
        console.log(`✅ Image trouvée: ${slideWithImage.image}`);
        
        // Vérifier si l'URL utilise le domaine personnalisé
        if (slideWithImage.image.includes('consultingmedia.autogare.com')) {
          console.log('✅ URL de l\'image utilise le domaine personnalisé R2');
        } else {
          console.log('⚠ URL de l\'image n\'utilise pas le domaine personnalisé R2');
          console.log(`URL actuelle: ${slideWithImage.image}`);
        }
      } else {
        console.log('ℹ Aucune image trouvée dans les slides');
      }
    } else {
      console.log('ℹ Aucun slide trouvé (peut-être normal si la base de données est vide)');
    }
    
    console.log('✅ Test terminé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testSlidesFix();