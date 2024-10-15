#!/bin/bash


#"1.0.0" - 8137fe4b
#"1.0.1" - 2e8650db
#"1.0.2" - 66096206
#"1.0.3" - 067b86de

first_commit=66096206 # 1.0.2
second_commit=067b86de # current

# Get tags for the first and second commit
tag_first_commit=$(git describe --tags --abbrev=0 $first_commit) # 1.0.2
tag_second_commit=$(git describe --tags --abbrev=0 $second_commit) # current

# Check if the tag of the second commit is the same as the tag of the first
if [ "$tag_first_commit" = "$tag_second_commit" ]; then
    tag_second_commit='current'
fi

# Check if the "upload" directory exists
if [ ! -d "upload" ]; then
    echo "Creating 'upload' directory"
    mkdir "upload"
fi

# Perform diff and copy files
git diff --name-only $first_commit^..$second_commit | while read file; do
    # Create ZIP archive and add files to it
    zip -r "upload/SUM-$tag_first_commit-$tag_second_commit.zip" "$file"

done

echo "Finished copying files to 'upload' directory"
echo "Tag of the first commit: $tag_first_commit"
echo "Tag of the second commit: $tag_second_commit"
