<h4><%= title %> &nbsp;<small><a href="#" class="select select_all"><%= t("ui.filter_pane.select_all")%></a></small></h4>
<div>
  <% checkboxes.forEach(function(checkbox) { %>
    <%= checkbox %>
  <% }); %>
</div>
