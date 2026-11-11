function generateSortingSteps(algoId, initialArr) {
      const steps = [];
      const arr = initialArr.map((v, idx) => ({
        id: `bar-${idx}-${typeof v === 'object' && v !== null ? v.val : v}`,
        val: typeof v === 'object' && v !== null ? v.val : v
      }));
      const n = arr.length;
      let comparisons = 0, swaps = 0;
      const sortedSet = new Set();

      function push(activeLine, desc, subDesc, pointers = {}, hl = {}) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: arr.map(item => ({ ...item })),
          activeLine, description: desc, subDescription: subDesc,
          pointers,
          highlights: {
            comparing: hl.comparing || [],
            swapping: hl.swapping || [],
            sorted: Array.from(sortedSet),
            active: hl.active || []
          },
          metrics: { comparisons, swaps }
        });
      }

      if (algoId === 'bubble-sort') {
        push(1, 'Starting Bubble Sort.', `Array of ${n} elements. Adjacent elements compared each pass.`);
        for (let i = 0; i < n; i++) {
          let swapped = false;
          push(3, `Pass i = ${i}. Scanning unsorted prefix.`, `Pass #${i + 1} bubbles largest item to index ${n - 1 - i}.`, { i });
          for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            push(6, `Comparing arr[${j}] (${arr[j].val}) and arr[${j+1}] (${arr[j+1].val}).`, arr[j].val > arr[j+1].val ? `${arr[j].val} > ${arr[j+1].val}: Out of order. Exchanging positions!` : `${arr[j].val} <= ${arr[j+1].val}: In order.`, { i, j, 'j+1': j+1 }, { comparing: [j, j+1] });
            if (arr[j].val > arr[j+1].val) {
              swaps++;
              const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
              swapped = true;
              push(7, `Swapped elements at index ${j} and ${j+1}: now [${arr[j].val}, ${arr[j+1].val}].`, `Bars gliding horizontally to exchange slots.`, { i, j, 'j+1': j+1 }, { swapping: [j, j+1] });
            }
          }
          sortedSet.add(n - 1 - i);
          if (!swapped) {
            push(9, 'Optimization: No swaps occurred during this pass.', 'Array is already sorted! Terminating early in O(N).');
            break;
          }
        }
      } else if (algoId === 'selection-sort') {
        push(1, 'Starting Selection Sort.', `Array of ${n} elements. Iteratively finding minimum in unsorted suffix.`);
        for (let i = 0; i < n; i++) {
          let minIdx = i;
          push(4, `Pass i = ${i}: Initializing min_idx = ${i} (value: ${arr[i].val}).`, `Scanning unsorted subarray [${i+1}..${n-1}] for a smaller value.`, { i, min: minIdx }, { active: [minIdx] });
          for (let j = i + 1; j < n; j++) {
            comparisons++;
            push(6, `Comparing arr[${j}] (${arr[j].val}) with current min arr[${minIdx}] (${arr[minIdx].val}).`, arr[j].val < arr[minIdx].val ? `New minimum found: ${arr[j].val} < ${arr[minIdx].val}. Updating min pointer.` : `${arr[j].val} >= ${arr[minIdx].val}. Minimum unchanged.`, { i, j, min: minIdx }, { comparing: [j, minIdx] });
            if (arr[j].val < arr[minIdx].val) {
              minIdx = j;
              push(7, `Updated min pointer to index ${minIdx} (value: ${arr[minIdx].val}).`, `Current smallest element found so far.`, { i, j, min: minIdx }, { active: [minIdx] });
            }
          }
          if (minIdx !== i) {
            swaps++;
            const t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;
            push(9, `Swapped arr[${i}] (${arr[minIdx].val}) with minimum arr[${minIdx}] (${arr[i].val}).`, `Minimum element glided into finalized slot ${i}.`, { i, min: minIdx }, { swapping: [i, minIdx] });
          }
          sortedSet.add(i);
        }
      } else if (algoId === 'insertion-sort') {
        push(1, 'Starting Insertion Sort.', `Array of ${n} elements. Inserting items one by one into sorted prefix.`);
        sortedSet.add(0);
        for (let i = 1; i < n; i++) {
          const keyItem = arr[i];
          let j = i - 1;
          push(3, `Selected key = arr[${i}] (${keyItem.val}) to insert into sorted prefix [0..${i-1}].`, `Comparing key backwards with preceding sorted elements.`, { i, key: keyItem.val }, { active: [i] });
          while (j >= 0 && arr[j].val > keyItem.val) {
            comparisons++;
            push(5, `Comparing arr[${j}] (${arr[j].val}) with key (${keyItem.val}).`, `${arr[j].val} > ${keyItem.val}: Shifting arr[${j}] right to index ${j+1}.`, { i, j, key: keyItem.val }, { comparing: [j, j+1] });
            const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
            swaps++;
            push(6, `Shifted ${arr[j+1].val} right to slot ${j+1}.`, `Making room for key ${keyItem.val}.`, { i, j, key: keyItem.val }, { swapping: [j, j+1] });
            j--;
          }
          if (j >= 0) comparisons++;
          sortedSet.add(i);
          push(8, `Inserted key (${keyItem.val}) into slot arr[${j+1}].`, `Sorted prefix now covers indices [0..${i}].`, { i, key: keyItem.val });
        }
      } else if (algoId === 'merge-sort') {
        push(1, 'Starting Merge Sort (Divide & Conquer).', `Array of ${n} elements. Recursively dividing into halves.`);
        function ms(left, right) {
          if (left >= right) return;
          const mid = Math.floor((left + right) / 2);
          push(4, `Dividing range [${left}..${right}] at mid = ${mid}.`, `Left half: [${left}..${mid}], Right half: [${mid+1}..${right}].`, { left, mid, right });
          ms(left, mid);
          ms(mid + 1, right);
          merge(left, mid, right);
        }
        function merge(left, mid, right) {
          const L = arr.slice(left, mid + 1).map(x => ({ ...x }));
          const R = arr.slice(mid + 1, right + 1).map(x => ({ ...x }));
          push(12, `Merging sorted subarrays L=[${L.map(x=>x.val).join(', ')}] and R=[${R.map(x=>x.val).join(', ')}] into [${left}..${right}].`, `Comparing elements pairwise from L and R.`, { left, mid, right });
          let i = 0, j = 0, k = left;
          while (i < L.length && j < R.length) {
            comparisons++;
            push(16, `Comparing L[${i}] (${L[i].val}) and R[${j}] (${R[j].val}).`, L[i].val <= R[j].val ? `${L[i].val} <= ${R[j].val}: Placing ${L[i].val} into slot ${k}.` : `${R[j].val} < ${L[i].val}: Placing ${R[j].val} into slot ${k}.`, { k, i, j }, { comparing: [k] });
            if (L[i].val <= R[j].val) {
              arr[k] = { ...L[i] };
              swaps++;
              push(17, `Wrote element (${L[i].val}) into slot ${k}.`, `Advancing pointer k and left pointer i.`, { k, i, j }, { swapping: [k] });
              i++;
            } else {
              arr[k] = { ...R[j] };
              swaps++;
              push(19, `Wrote element (${R[j].val}) into slot ${k}.`, `Advancing pointer k and right pointer j.`, { k, i, j }, { swapping: [k] });
              j++;
            }
            k++;
          }
          while (i < L.length) {
            arr[k] = { ...L[i] }; swaps++;
            push(21, `Flushing remaining element (${L[i].val}) to slot ${k}.`, `Copying remaining sorted elements.`, { k }, { swapping: [k] });
            i++; k++;
          }
          while (j < R.length) {
            arr[k] = { ...R[j] }; swaps++;
            push(23, `Flushing remaining element (${R[j].val}) to slot ${k}.`, `Copying remaining sorted elements.`, { k }, { swapping: [k] });
            j++; k++;
          }
          for (let x = left; x <= right; x++) sortedSet.add(x);
          push(24, `Merged range [${left}..${right}] is sorted: [${arr.slice(left, right+1).map(x=>x.val).join(', ')}].`, `Subarray successfully merged.`);
        }
        ms(0, n - 1);
      } else if (algoId === 'quick-sort') {
        // Quick Sort (default)
        push(1, 'Starting Quick Sort with Lomuto partitioning.', `Array of ${n} elements. Last item chosen as pivot each recursion.`);
        function qs(low, high) {
          push(2, `Checking recursive condition: low (${low}) < high (${high}).`, low < high ? `Subarray [${low}..${high}] has size > 1.` : `Base case reached.`, { low, high });
          if (low < high) {
            push(4, `Calling partition(arr, ${low}, ${high}).`, 'Partitioning elements smaller or equal to pivot to the left.', { low, high });
            const pivotVal = arr[high].val;
            let i = low - 1;
            push(11, `Pivot selected: arr[${high}] = ${pivotVal}.`, `Boundary pointer i initialized to ${i}.`, { low, high, pivot: high, i: i >= 0 ? i : 'None' }, { active: [high] });
            for (let j = low; j < high; j++) {
              comparisons++;
              push(15, `Comparing arr[${j}] (${arr[j].val}) with pivot (${pivotVal}).`, arr[j].val <= pivotVal ? `${arr[j].val} <= ${pivotVal}: Belongs in left partition. Incrementing i.` : `${arr[j].val} > ${pivotVal}: Belongs in right partition.`, { low, high, pivot: high, i: i >= 0 ? i : 'None', j }, { comparing: [j, high], active: [high] });
              if (arr[j].val <= pivotVal) {
                i++;
                if (i !== j) {
                  swaps++;
                  const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                  push(17, `Swapped arr[${i}] (${arr[i].val}) and arr[${j}] (${arr[j].val}).`, `Moved element <= pivot to left boundary index i=${i}.`, { low, high, pivot: high, i, j }, { swapping: [i, j], active: [high] });
                }
              }
            }
            swaps++;
            const t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
            const pIdx = i + 1;
            sortedSet.add(pIdx);
            push(20, `Placed pivot (${pivotVal}) into finalized sorted position index ${pIdx}.`, `Pivot glided from slot ${high} to ${pIdx}. Left <= ${pivotVal}, Right >= ${pivotVal}.`, { pivot: pIdx }, { swapping: [pIdx, high] });
            qs(low, pIdx - 1);
            qs(pIdx + 1, high);
          } else if (low === high) {
            sortedSet.add(low);
          }
        }
        qs(0, n - 1);
      }

      else if (algoId === 'heap-sort') {
        push(14, 'Starting Heap Sort.', 'Phase 1: Build Max-Heap from the unsorted array.', { high: n });

        function heapify(heapSize, rootIdx) {
          let largest = rootIdx;
          const left = 2 * rootIdx + 1;
          const right = 2 * rootIdx + 2;

          push(2, `Heapify subtree at index ${rootIdx}.`, `Root candidate: ${arr[rootIdx].val}. Checking child nodes.`, { i: rootIdx, high: heapSize }, { active: [rootIdx] });

          if (left < heapSize) {
            comparisons++;
            push(5, `Comparing root with left child.`, `arr[left=${left}] = ${arr[left].val} vs arr[largest=${largest}] = ${arr[largest].val}.`, { i: rootIdx, j: left, high: heapSize }, { comparing: [largest, left] });
            if (arr[left].val > arr[largest].val) {
              largest = left;
              push(6, `Left child is larger.`, `Updating largest = ${left} (val: ${arr[largest].val}).`, { i: rootIdx, j: largest, largest, high: heapSize }, { active: [largest] });
            }
          }

          if (right < heapSize) {
            comparisons++;
            push(7, `Comparing with right child.`, `arr[right=${right}] = ${arr[right].val} vs arr[largest=${largest}] = ${arr[largest].val}.`, { i: rootIdx, j: right, high: heapSize }, { comparing: [largest, right] });
            if (arr[right].val > arr[largest].val) {
              largest = right;
              push(8, `Right child is larger.`, `Updating largest = ${right} (val: ${arr[largest].val}).`, { i: rootIdx, j: largest, largest, high: heapSize }, { active: [largest] });
            }
          }

          if (largest !== rootIdx) {
            swaps++;
            push(9, `Max-Heap property violated.`, `Swapping parent ${arr[rootIdx].val} with larger child ${arr[largest].val}.`, { i: rootIdx, j: largest, high: heapSize }, { swapping: [rootIdx, largest] });
            const tmp = arr[rootIdx];
            arr[rootIdx] = arr[largest];
            arr[largest] = tmp;

            push(10, `Parent and child swapped.`, `Recursively heapifying sub-tree rooted at index ${largest}.`, { i: rootIdx, j: largest, high: heapSize }, { active: [largest] });
            heapify(heapSize, largest);
          }
        }

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
          push(16, `Building Max-Heap: heapify node ${i}.`, `Non-leaf node at index ${i} (value ${arr[i].val}).`, { i, high: n }, { active: [i] });
          heapify(n, i);
        }
        push(17, 'Max-Heap successfully constructed!', `Root holds maximum element (${arr[0].val}). Starting Phase 2: Extraction.`, { high: n }, { active: [0] });

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
          comparisons++;
          swaps++;
          push(19, `Extracting maximum (${arr[0].val}) to position ${i}.`, `Swap max element at root with last unsorted element ${arr[i].val}.`, { low: 0, high: i, i }, { comparing: [0, i] });
          push(20, `Swapping root with index ${i}.`, `Moving ${arr[0].val} to final sorted position ${i}.`, { low: 0, high: i, i }, { swapping: [0, i] });
          
          const tmp = arr[0];
          arr[0] = arr[i];
          arr[i] = tmp;
          sortedSet.add(i);

          push(20, `Element ${arr[i].val} sorted at index ${i}.`, `Remaining unsorted heap size is now ${i}.`, { high: i }, { active: [i] });
          push(21, `Restoring Max-Heap for reduced heap of size ${i}.`, `Heapify root node index 0.`, { i: 0, high: i });
          heapify(i, 0);
        }
        sortedSet.add(0);
        push(22, 'Heap Sort Complete!', `All ${n} elements fully sorted in O(N log N) time and O(1) auxiliary space.`, {}, {});
      }

      for (let k = 0; k < n; k++) sortedSet.add(k);
      push(21, 'Sorting Complete!', `Final array: [${arr.map(x=>x.val).join(', ')}]. Total comparisons: ${comparisons}, swaps: ${swaps}.`);
      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // B. Searching Steps (Linear, Binary, Jump, and Ternary Search)
    function generateSearchingSteps(algoId, initialArr, target) {
      const steps = [];
      const needsSort = algoId !== 'linear-search';
      const arr = needsSort ? [...initialArr].sort((a,b)=>a-b) : [...initialArr];
      const n = arr.length;
      let comparisons = 0;

      function push(activeLine, desc, subDesc, pointers = {}, hl = {}) {
        steps.push({
          stepIndex: steps.length, totalSteps: 0,
          state: [...arr], activeLine, description: desc, subDescription: subDesc,
          pointers,
          highlights: {
            comparing: hl.comparing || [],
            sorted: hl.sorted || [],
            active: hl.active || [],
            dimmed: hl.dimmed || []
          },
          metrics: { comparisons }
        });
      }

      if (algoId === 'linear-search') {
        push(1, `Starting Linear Search for target = ${target}.`, `Scanning array sequentially from index 0 to ${n-1}.`, { i: 0, target }, { active: [0] });
        let found = false;
        for (let i = 0; i < n; i++) {
          comparisons++;
          const isMatch = arr[i] === target;
          push(3, `Comparing arr[${i}] (${arr[i]}) with target (${target}).`,
            isMatch ? `MATCH FOUND: arr[${i}] == ${target}!` : `arr[${i}] != ${target}. Advancing to next index.`,
            { i, target },
            isMatch ? { comparing: [i], sorted: [i] } : { comparing: [i] }
          );
          if (isMatch) {
            found = true;
            push(4, `Linear Search Succeeded! Target ${target} located at index ${i}.`, `Total comparisons made: ${comparisons}.`, { i, target }, { sorted: [i] });
            break;
          }
        }
        if (!found) {
          push(5, `Target ${target} was NOT found in the array.`, `Checked all ${n} elements. Returning -1. Total comparisons: ${comparisons}.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'binary-search') {
        push(1, `Starting Binary Search for target = ${target}.`, `Array is sorted: [${arr.join(', ')}]. Search interval begins [0..${n-1}].`, { low: 0, high: n - 1, target });
        let low = 0, high = n - 1, found = false;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const dimmed = [];
          for (let i = 0; i < low; i++) dimmed.push(i);
          for (let i = high + 1; i < n; i++) dimmed.push(i);

          push(5, `Calculated midpoint: mid = (${low} + ${high}) // 2 = ${mid} (arr[mid] = ${arr[mid]}).`, `Active window: [${low}..${high}]. Checking if arr[${mid}] == ${target}.`, { low, mid, high, target }, { active: [mid], dimmed });
          comparisons++;
          if (arr[mid] === target) {
            found = true;
            push(7, `TARGET FOUND: arr[${mid}] == ${target}!`, `Binary search succeeded at index ${mid} with only ${comparisons} comparisons.`, { low, mid, high, target }, { sorted: [mid], dimmed });
            break;
          } else if (arr[mid] < target) {
            push(9, `arr[${mid}] (${arr[mid]}) < target (${target}). Target must lie to the RIGHT.`, `Eliminating left half [${low}..${mid}]. Updating low = ${mid + 1}.`, { low: mid + 1, mid, high, target }, { comparing: [mid], dimmed });
            low = mid + 1;
          } else {
            push(11, `arr[${mid}] (${arr[mid]}) > target (${target}). Target must lie to the LEFT.`, `Eliminating right half [${mid}..${high}]. Updating high = ${mid - 1}.`, { low, mid, high: mid - 1, target }, { comparing: [mid], dimmed });
            high = mid - 1;
          }
        }
        if (!found) {
          push(12, `Target ${target} was NOT found in the array.`, `low (${low}) > high (${high}): Search interval exhausted. Returning -1.`, { low, high, target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'jump-search') {
        const step = Math.max(1, Math.floor(Math.sqrt(n)));
        push(2, `Starting Jump Search for target = ${target}.`, `Optimal block jump step = √(${n}) ≈ ${step}. Jumping across sorted array.`, { prev: 0, step, target });
        let prev = 0, curr = step, found = false;

        while (curr < n && arr[Math.min(curr, n) - 1] < target) {
          comparisons++;
          const blockHl = Array.from({ length: Math.min(curr, n) - prev }, (_, i) => prev + i);
          push(6, `Jumped block: arr[${Math.min(curr, n) - 1}] (${arr[Math.min(curr, n) - 1]}) < target (${target}).`, `Target is larger than block boundary. Jumping ahead by ${step} elements.`, { prev, curr: Math.min(curr, n) - 1, step, target }, { active: blockHl });
          prev = curr;
          curr += step;
        }

        const endBound = Math.min(curr, n);
        push(10, `Target may lie within block indices [${prev}..${endBound - 1}].`, `arr[${endBound - 1}] >= ${target}. Starting linear search within block.`, { prev, curr: endBound - 1, target }, { active: Array.from({ length: endBound - prev }, (_, i) => prev + i) });

        while (prev < endBound) {
          comparisons++;
          const isMatch = arr[prev] === target;
          push(10, `Inspecting arr[${prev}] (${arr[prev]}).`, isMatch ? `MATCH FOUND: arr[${prev}] == ${target}!` : `${arr[prev]} < ${target}. Advancing.`, { prev, target }, isMatch ? { sorted: [prev] } : { comparing: [prev] });
          if (isMatch) {
            found = true;
            push(14, `Jump Search Succeeded! Target ${target} located at index ${prev}.`, `Completed in O(√N) time with ${comparisons} comparisons.`, { prev, target }, { sorted: [prev] });
            break;
          }
          prev++;
        }
        if (!found) {
          push(15, `Target ${target} NOT found in array.`, `Block linear search exhausted. Returning -1.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      } else if (algoId === 'ternary-search') {
        push(1, `Starting Ternary Search for target = ${target}.`, `Divides search space into 3 equal segments using two midpoints (mid1, mid2).`, { low: 0, high: n - 1, target });
        let low = 0, high = n - 1, found = false;
        while (low <= high) {
          const mid1 = low + Math.floor((high - low) / 3);
          const mid2 = high - Math.floor((high - low) / 3);
          const dimmed = [];
          for (let i = 0; i < low; i++) dimmed.push(i);
          for (let i = high + 1; i < n; i++) dimmed.push(i);

          push(2, `Calculated mid1 = ${mid1} (${arr[mid1]}) and mid2 = ${mid2} (${arr[mid2]}).`, `Trisecting interval into [${low}..${mid1}], [${mid1+1}..${mid2-1}], and [${mid2}..${high}].`, { low, mid1, mid2, high, target }, { active: [mid1, mid2], dimmed });

          comparisons++;
          if (arr[mid1] === target) {
            found = true;
            push(5, `TARGET FOUND at mid1: arr[${mid1}] == ${target}!`, `Found in O(log₃ N) time!`, { low, mid1, mid2, high, target }, { sorted: [mid1], dimmed });
            break;
          }
          comparisons++;
          if (arr[mid2] === target) {
            found = true;
            push(6, `TARGET FOUND at mid2: arr[${mid2}] == ${target}!`, `Found in O(log₃ N) time!`, { low, mid1, mid2, high, target }, { sorted: [mid2], dimmed });
            break;
          }

          if (target < arr[mid1]) {
            push(8, `target (${target}) < arr[mid1] (${arr[mid1]}). Target lies in FIRST third.`, `Discarding middle and right segments. Updating high = ${mid1 - 1}.`, { low, mid1, mid2, high: mid1 - 1, target }, { comparing: [mid1], dimmed });
            high = mid1 - 1;
          } else if (target > arr[mid2]) {
            push(10, `target (${target}) > arr[mid2] (${arr[mid2]}). Target lies in THIRD segment.`, `Discarding left and middle segments. Updating low = ${mid2 + 1}.`, { low: mid2 + 1, mid1, mid2, high, target }, { comparing: [mid2], dimmed });
            low = mid2 + 1;
          } else {
            push(12, `Target lies in MIDDLE segment [${mid1 + 1}..${mid2 - 1}].`, `Discarding outer segments. Updating low = ${mid1 + 1}, high = ${mid2 - 1}.`, { low: mid1 + 1, mid1, mid2, high: mid2 - 1, target }, { comparing: [mid1, mid2], dimmed });
            low = mid1 + 1;
            high = mid2 - 1;
          }
        }
        if (!found) {
          push(14, `Target ${target} was NOT found in the array.`, `Search interval exhausted. Returning -1.`, { target }, { dimmed: Array.from({length: n}, (_, idx) => idx) });
        }
      }

      for (let s of steps) s.totalSteps = steps.length;
      return steps;
    }

    // B2. Two Pointers & Sliding Window Steps (Dedicated Domain)