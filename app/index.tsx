import { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import useCardStore from '../stores/card-store';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import TimePickerModal from '../components/TimePickerModal';
import { scheduleNotification, requestNotificationPermissions } from '../utils/notifications';

export default function Index() {
  const { cards, reviewCard, getDueCards, notificationSettings, updateNotificationSettings } = useCardStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dueCards, setDueCards] = useState<ReturnType<typeof getDueCards>>([]);
  
  // Handle first-time setup
  useEffect(() => {
    if (notificationSettings.isFirstTime) {
      const initializeNotifications = async () => {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleNotification(notificationSettings.notificationTime);
        }
        updateNotificationSettings({ 
          isFirstTime: false,
          enabled: hasPermission 
        });
      };
      
      initializeNotifications();
    }
  }, []);

  useEffect(() => {
    setDueCards(getDueCards());
  }, [cards]);

  const currentCard = dueCards[currentCardIndex];
  const rotate = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    if (!currentCard) return {};
    return {
      transform: [
        {
          rotateY: `${interpolate(rotate.value, [0, 1], [0, 180])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    if (!currentCard) return {};
    return {
      transform: [
        {
          rotateY: `${interpolate(rotate.value, [0, 1], [180, 360])}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const handleFlip = () => {
    if (!currentCard) return;
    rotate.value = withTiming(isFlipped ? 0 : 1, { duration: 300 });
    setIsFlipped(!isFlipped);
  };

  const handleReview = (quality: number) => {
    if (!currentCard) return;
    reviewCard(currentCard.id, quality);
    setIsFlipped(false);
    rotate.value = withTiming(0, { duration: 0 });
    
    // Update current card index and due cards
    const remainingDueCards = getDueCards();
    setDueCards(remainingDueCards);
    setCurrentCardIndex((prev) => 
      prev + 1 >= remainingDueCards.length ? 0 : prev + 1
    );
  };

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No cards yet!</Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add Cards</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  if (dueCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No cards due for review!</Text>
        <Text style={styles.subText}>Come back later</Text>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add New Card</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Text style={styles.cardText}>{currentCard?.question}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Text style={styles.cardText}>{currentCard?.answer}</Text>
        </Animated.View>
      </View>

      {!isFlipped ? (
        <TouchableOpacity style={styles.button} onPress={handleFlip}>
          <Text style={styles.buttonText}>Show Answer</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.ratingContainer}>
          <TouchableOpacity style={[styles.ratingButton, styles.hardButton]} onPress={() => handleReview(2)}>
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ratingButton, styles.goodButton]} onPress={() => handleReview(4)}>
            <Text style={styles.buttonText}>Good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ratingButton, styles.easyButton]} onPress={() => handleReview(5)}>
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentCardIndex + 1} / {dueCards.length} cards
        </Text>
      </View>

      <Link href="/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>Add New Card</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    marginBottom: 20,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#f8f8f8',
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  ratingButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  hardButton: {
    backgroundColor: '#FF3B30',
  },
  goodButton: {
    backgroundColor: '#34C759',
  },
  easyButton: {
    backgroundColor: '#007AFF',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
  },
});
