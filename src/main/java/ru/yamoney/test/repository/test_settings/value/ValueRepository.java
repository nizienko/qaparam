package ru.yamoney.test.repository.test_settings.value;

import ru.yamoney.test.entity.DomainObject;
import ru.yamoney.test.repository.CommonRepository;

import java.util.List;

/**
 * Created by def on 18.02.16.
 */
public interface ValueRepository<V extends DomainObject> extends CommonRepository<V> {
    V fetchById(long instanceId, long parameterId);
    List<V> fetchByInstanceId(long instanceId);
}
