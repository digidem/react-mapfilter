<div class="<%= className %>">
  <label>
    <input type="checkbox" value="<%= key %>" checked>
    <span class="<%= color === 'none' ? '' : 'label' %>" style="background-color: <%= color %>"><%= text %></span>
    &nbsp;<small><a class="select select_one" href="javascript:void(0);"><%= t("ui.filter_pane.select_one") %></a></small>
  </label>
</div>
