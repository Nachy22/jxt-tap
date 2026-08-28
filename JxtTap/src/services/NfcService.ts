import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';

// Call this once when the app starts (e.g. in App.tsx)
export const initNfc = async (): Promise<boolean> => {
  try {
    const supported = await NfcManager.isSupported();
    if (!supported) {
      console.warn('NFC is not supported on this device');
      return false;
    }
    await NfcManager.start();
    return true;
  } catch (error) {
    console.error('NFC init failed:', error);
    return false;
  }
};

// Reads a single tap and returns the card's unique ID
export const readCardOnce = async (): Promise<string | null> => {
  try {
    // Ask Android to open the NFC reader session
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const tag: TagEvent | null = await NfcManager.getTag();

    if (!tag || !tag.id) {
      return null;
    }

    // tag.id is a byte array in hex string form — this is our card UID
    return tag.id;
  } catch (error) {
    // This fires normally if the user cancels or nothing is tapped in time
    console.log('NFC read cancelled or failed:', error);
    return null;
  } finally {
    // Always clean up the reader session, even if something went wrong
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
};

// Call this when the app closes or the screen unmounts
export const stopNfc = () => {
  NfcManager.cancelTechnologyRequest().catch(() => {});
};