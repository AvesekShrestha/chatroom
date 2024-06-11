const addGroup = (groups, groupName) => {
  if (!groups.includes(groupName)) groups.push(groupName);
};

module.exports = { addGroup };
