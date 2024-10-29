// Update the handleUsernameChange function in the Settings component
const handleUsernameChange = (newUsername) => {
  try {
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    // Update local storage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{"username":"demo","password":"demo"}');
    const updatedUser = {
      ...storedUser,
      username: newUsername
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      username: newUsername
    }));

    // Update app context
    updateSetting('username', newUsername);
    setSuccess('Username updated successfully');
    setError('');
  } catch (error) {
    console.error('Failed to update username:', error);
    setError('Failed to update username');
  }
};