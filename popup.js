$(function() {
  var div = $('#tabs');

  function buildTab(tabId, windowId, str, src) {
    var tab = $("<p>").addClass('tab').
                       attr('data-tabId', tabId).
                       attr('data-windowId', windowId).
                       attr('data-str', str.toLowerCase());
    $('<img>').attr('src', src).appendTo(tab);
    $('<span>').text(str).appendTo(tab);
    return tab;
  }
  chrome.tabs.query({}, function getTabs(tabs) {
    var matched = [];

    $.each(tabs, function(i, tab) {
      div.append(buildTab(tab.id, tab.windowId, tab.title, tab.favIconUrl));
      div.append(buildTab(tab.id, tab.windowId, tab.url, tab.favIconUrl));
    });

    div.children().first().addClass('selected');
  });

  $('#input').on('input', function filterTabs() {
    var value = $(this).val().toLowerCase();
    div.children().each(function(idx, tab) {
      tab = $(tab);
      tab.toggle(tab.attr('data-str').match(value) !== null);
    })
    var selected = div.find('.selected');
    if (!selected.is(':visible')) {
      selected.removeClass('selected');
      div.children(':visible').first().addClass('selected');
    }
  });

  function switchToTab(element) {
    var tabId = parseInt(element.attr('data-tabId'));
    var windowId = parseInt(element.attr('data-windowId'));
    chrome.tabs.update(tabId, {active: true});
    chrome.windows.update(windowId, {focused: true});
  }

  // "live" click handler binding since we dynamically add .tabs
  $(document).on('click', '.tab', function(e) {
    switchToTab($(e.target));
  });
  $(document).on('keypress', function(e) {
    if (e.charCode == 13) {
      switchToTab($('.selected'));
    }
  });
  $(document).on('keydown', function(e) {
    if (e.keyCode === 40 || e.keyCode === 38) { // ARROWED
      var visible = div.children(':visible');
      var current = div.find('.selected');
      var idx = visible.index(current);
      if (e.keyCode == 40 && idx < visible.length - 1) {
        // DOWN
        current.removeClass('selected');
        $(visible[idx+1]).addClass('selected');
      }
      else if (e.keyCode == 38 && idx > 0) {
        // UP
        current.removeClass('selected');
        $(visible[idx-1]).addClass('selected');
      }
      e.preventDefault();
    }
  });
});
