import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, Dimensions, FlatList} from 'react-native';

import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../component/NavBar';
import NotificationCard, {TextStatus} from '../component/home/OrderItem';
import DeleteModal, {
  LeftRightButton,
} from '../component/popup/DeleteConfirmationModal';
import Article from '../../screens/component/popup/Article';
import {NoDataView} from '../component/NoDataView';
import {getNotification} from '../../../services/notification';

const NotificationScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [notiModalVisible, setNotiModalVisible] = useState(false);
  const [notification, setNotification] = useState([]);
  const [info, setInfo] = useState(null);
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToDeleteConfirmationScreen = () => {
    setModalVisible((prev) => !prev);
  };
  const modalMessage = t('delete_all_notification');
  const modalSubMessage = t('delete_notification_confirmation_message');
  const ButtonGroup = () => {
    const left = {
      text: t('no'),
      onPress: navigateToDeleteConfirmationScreen,
    };
    const right = {
      text: t('yes'),
      onPress: navigateToDeleteConfirmationScreen,
    };
    return LeftRightButton({option: 'RED', left, right});
  };

  const onPress = (title, description, _id, image) => {
    setInfo({
      title,
      description,
      _id,
      image,
    });
    setNotiModalVisible(true);
  };

  useEffect(() => {
    const handleGetNotification = async () => {
      try {
        const results = await getNotification({skip: 0, t});

        setNotification(results);
      } catch (err) {
        console.log('NotificationScreen -> handleGetNotification err', err);
      }
    };

    handleGetNotification();
  }, []);
  return (
    <>
      <NavBar title={t('notification')}
      {...{LeftButton, handleLeftNavButton}}>
        {notification.length > 0 ? (
          <FlatList
            data={notification}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => {
              return (
                <NotificationCard
                  type="notification"
                  order_name={item.title}
                  onPress={() =>
                    onPress(item.title, item.description, item._id, item.image)
                  }
                  subTitle={item.description}
                  {...{
                    TextStatus: TextStatus({color: 'Right'}),
                  }}
                />
              );
            }}
          />
        ) : (
          <NoDataView />
        )}
      </NavBar>
      <Article
        modalVisible={notiModalVisible}
        setModalVisible={setNotiModalVisible}
        type="notification"
        image={`${info?._id}/${info?.image}`}
        description={info?.description}
        title={info?.title}
      />
      <DeleteModal
        {...{
          message: modalMessage,
          subMessage: modalSubMessage,
          navigation,
          modalVisible,
          setModalVisible,
          ButtonGroup,
        }}
      />
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({});

export default NotificationScreen;
