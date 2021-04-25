const moment = require("moment");

exports.formatDate = (date, format) => {
  return moment(date).format(format);
};

exports.stripTag = (input) => {
  return input.replace(/<(?:.|\n)*?>/gm, "");
};

exports.truncate = (str, len) => {
  if (str.length > len && str.length > 0) {
    let new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    return new_str + "...";
  }
  return str;
};

exports.editeIcon = (storyUserId, logedUserId, storyId, floating = true) => {
  if (storyUserId._id.toString() === logedUserId._id.toString()) {
    if (floating) {
      return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
    } else {
      return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
    }
  } else {
    return "";
  }
};

exports.select = function (selected, options) {
  return options
    .fn(this)
    .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"')
    .replace(
      new RegExp(">" + selected + "</option>"),
      ' selected="selected"$&'
    );
};
