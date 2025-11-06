class CreateSnippets < ActiveRecord::Migration[8.1]
  def change
    create_table :snippets do |t|
      t.text :text
      t.text :summary

      t.timestamps
    end
  end
end
