const React = require('react');
const { renderToString } = require('react-dom/server');

const options = {
  trigger: '@',
  values: [
    {
      key: '1',
      first_name: 'Delia',
      last_name: 'Manea',
      fullName: 'Delia Manea',
      slug: 'deliamanea'
    },
    {
      key: '2',
      first_name: 'Greg',
      last_name: 'Forel',
      fullName: 'Greg Forel',
      slug: 'gregforel'
    }
  ],
  lookup: (user) => user.first_name + ' ' + user.last_name,
  fillAttr: 'fullName',
  allowSpaces: true,
  selectTemplate: function(item) {
    return renderToString(
      React.createElement('span', { className: 'fr-deletable fr-tribute' }, 
        React.createElement('a', null, `@${item.original.fullName}`)
      )
    );
  }
};

module.exports = { options };
